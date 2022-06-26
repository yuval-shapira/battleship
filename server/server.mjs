


//start the server
(async () => {
    await server.listen(API_PORT, API_HOST);
    log.magenta(
      `server is live on`,
      `  ✨ ⚡  http://${API_HOST}:${API_PORT} ✨ ⚡`
    );
  })().catch((error) => log.error(error));