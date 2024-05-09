import App from "../components/App";
import { MetaProvider, Title } from "@solidjs/meta";

export default (props: {
	counter: number;
}) => {
	return (
		<MetaProvider>
			<Title>Hello Elysia</Title>
			<App counter={props.counter} />
		</MetaProvider>
	);
};
