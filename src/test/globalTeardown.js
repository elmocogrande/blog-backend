export default async function globalTeardown() {
  await global._MONGOINSTANCE.stop()
}
