import { generateHydrationScript, getAssets } from "solid-js/web";

export default ({
	children,
	head,
}: {
	children: string;
	head: string;
}) => `<!DOCTYPE html>
<html lang="en">
   <head>
      ${generateHydrationScript()}
      ${getAssets()}
      ${head}
   </head>
   <body>
      <div id="app">
         ${children}
      </div>
   </body>
</html>
`;
