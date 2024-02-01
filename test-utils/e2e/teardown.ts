export default async () => {
	if (globalThis.__CONTAINER__) {
		await globalThis.__CONTAINER__.stop()
	}
}
