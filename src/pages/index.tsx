import App from "@src/components/App";

export default (props: {
	counter: number
}) => {
	return (
		<App counter={props.counter} />
	);
};
