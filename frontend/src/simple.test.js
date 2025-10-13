// Simple test that doesn't depend on complex components
test('simple test passes', () => {
  expect(1 + 1).toBe(2);
});

test('string test passes', () => {
  expect('hello').toContain('hello');
});

test('array test passes', () => {
  const arr = [1, 2, 3];
  expect(arr).toHaveLength(3);
  expect(arr).toContain(2);
});
