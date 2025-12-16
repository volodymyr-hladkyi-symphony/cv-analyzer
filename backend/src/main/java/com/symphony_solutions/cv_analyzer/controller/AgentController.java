package com.symphony_solutions.cv_analyzer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.symphony_solutions.cv_analyzer.dto.request.MatchRequestDto;
import com.symphony_solutions.cv_analyzer.dto.response.CandidateSummaryResponseDto;
import com.symphony_solutions.cv_analyzer.model.Resume;
import com.symphony_solutions.cv_analyzer.service.AgentSummaryService;
import com.symphony_solutions.cv_analyzer.service.ResumeService;
import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.retry.NonTransientAiException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

/**
 * REST controller for matching candidates to a job vacancy.
 */
@Slf4j
@RestController
@RequestMapping("/api/candidate-matcher")
@RequiredArgsConstructor
@Validated
public class AgentController {

  private final ResumeService resumeService;

  private final AgentSummaryService agentSummaryService;
  private final ObjectMapper objectMapper;

  /**
   * Returns the most relevant candidates for a given vacancy description, with LLM-generated summary and rating.
   *
   * @param request the vacancy description
   * @return list of candidate summaries with individual ratings
   */
  @PostMapping("/match")
  public List<CandidateSummaryResponseDto> matchCvs(@Valid @RequestBody MatchRequestDto request) {
    log.info("Processing candidate match request for vacancy: {}",
        request.getVacancyDescription().substring(0, Math.min(100, request.getVacancyDescription().length())));

    try {
      List<Resume> topResumes = resumeService.findTopCandidates(request.getVacancyDescription(), 5);
      List<CandidateSummaryResponseDto> summaries = new ArrayList<>();

      for (Resume resume : topResumes) {
        try {
          log.debug("Processing CV: {}", resume.getFilename());
          String summary = agentSummaryService.generateSummary(request.getVacancyDescription(), resume.getContent())
              .getContent();
          var ratingResponse = agentSummaryService
              .generateRating(request.getVacancyDescription(), resume.getContent());
          int rating = agentSummaryService.extractRatingFromContent(ratingResponse.getContent());

          CandidateSummaryResponseDto candidate = CandidateSummaryResponseDto.builder()
              .name(resume.getName())
              .filename(resume.getFilename())
              .summary(summary)
              .rating(rating)
              .build();
          summaries.add(candidate);
        } catch (NonTransientAiException e) {
          log.error("AI service error processing CV: {}", resume.getFilename(), e);
          // Re-throw AI exceptions so they can be handled by GlobalExceptionHandler
          throw e;
        } catch (Exception e) {
          log.error("Failed to process CV: {}", resume.getFilename(), e);
          // Continue with other CVs for non-AI errors
          // Could add a fallback candidate with error message
        }
      }

      log.info("Successfully processed {} candidates", summaries.size());
      return summaries;
    } catch (Exception e) {
      log.error("Error in candidate matching process", e);
      throw e; // Let GlobalExceptionHandler handle it
    }
  }

  /**
   * Streaming version of match endpoint. Emits NDJSON objects per candidate as they are ready.
   */
  @PostMapping(value = "/match/stream", produces = "application/x-ndjson")
  public StreamingResponseBody matchCvsStream(@Valid @RequestBody MatchRequestDto request) {
    return outputStream -> {
      try {
        var writer = outputStream;
        List<Resume> topResumes = resumeService.findTopCandidates(request.getVacancyDescription(), 5);

        for (Resume resume : topResumes) {
          try {
            String summary = agentSummaryService
                .generateSummary(request.getVacancyDescription(), resume.getContent())
                .getContent();
            var ratingResponse = agentSummaryService
                .generateRating(request.getVacancyDescription(), resume.getContent());
            int rating = agentSummaryService.extractRatingFromContent(ratingResponse.getContent());

            CandidateSummaryResponseDto candidate = CandidateSummaryResponseDto.builder()
                .name(resume.getName())
                .filename(resume.getFilename())
                .summary(summary)
                .rating(rating)
                .build();

            // Write one JSON object per line (NDJSON)
            String json = objectMapper.writeValueAsString(candidate) + "\n";
            writer.write(json.getBytes(java.nio.charset.StandardCharsets.UTF_8));
            writer.flush();
          } catch (NonTransientAiException e) {
            // Forward AI errors as a structured event and stop streaming
            var error = java.util.Map.of(
                "type", "error",
                "message", "AI service error while processing CV: " + resume.getFilename()
            );
            String json = objectMapper.writeValueAsString(error) + "\n";
            writer.write(json.getBytes());
            writer.flush();
            throw e;
          } catch (Exception e) {
            // Emit non-fatal error and continue to next resume
            var error = java.util.Map.of(
                "type", "warn",
                "message", "Failed to process CV: " + resume.getFilename()
            );
            String json = objectMapper.writeValueAsString(error) + "\n";
            writer.write(json.getBytes());
            writer.flush();
          }
        }

        // Done event
        var done = java.util.Map.of("type", "done");
        String json = objectMapper.writeValueAsString(done) + "\n";
        writer.write(json.getBytes());
        writer.flush();
      } catch (Exception ex) {
        // Best-effort final error emission
        try {
          var fatal = java.util.Map.of("type", "error", "message", "Streaming failed: " + ex.getMessage());
          String json = objectMapper.writeValueAsString(fatal) + "\n";
          outputStream.write(json.getBytes());
          outputStream.flush();
        } catch (Exception ignored) {
          // ignore
        }
      }
    };
  }
}
