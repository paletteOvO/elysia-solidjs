import { generateHydrationScript, getAssets } from "solid-js/web";

export default ({
	children,
	scripts,
}: {
	children: string;
	scripts: string;
}) => `<!DOCTYPE html>
<html lang="en">
   <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      ${getAssets()}
      ${generateHydrationScript()}
   </head>
   <body>
      <div id="app">
         ${children}
      </div>
      ${scripts}
   </body>
</html>
`;
