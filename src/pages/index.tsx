import App from "../components/App";
import { MetaProvider, Title } from "@solidjs/meta";
import { entry } from "../elysia_solid/start";

export default entry(
	(props: {
		counter: number;
	}) => {
		return (
			<MetaProvider>
				<Title>Hello Elysia</Title>
				<App counter={props.counter} />
			</MetaProvider>
		);
	},
);
