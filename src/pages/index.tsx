import { MetaProvider } from "@solidjs/meta";
import { Route, Router } from "@solidjs/router";
import { isServer } from "solid-js/web";
import { Suspense, lazy } from "solid-js";
import { DataProvider } from "@src/services/data_provider";

const App = lazy(() => import("@src/components/App"));
const Counter = lazy(() => import("@src/components/Counter"));

export default ({
	url,
}: {
	url?: string;
} = {}) => {
	return (
		<DataProvider>
			<MetaProvider>
				<Suspense>
					<Router url={isServer ? url : ""}>
						<Route path={"/"} component={App} />
						<Route path={"/counter"} component={Counter} />
					</Router>
				</Suspense>
			</MetaProvider>
		</DataProvider>
	);
};
