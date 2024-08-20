import { Slug } from './slug'

test('Slug Test', () => {
  const newSlug = Slug.createFromText('an example title')
  expect(newSlug.value).toEqual('an-example-title')
})
