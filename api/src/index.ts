// eslint-disable-next-line simple-import-sort/imports
import 'reflect-metadata';

import { bootstrap } from './application';

const port = process.env.PORT ?? 5819;

const main = async () => {
  const server = bootstrap();

  server.listen(port, () => console.log(`Server started. Listening on port ${port}`));
};

main().catch(console.error);
