export const cssProps = (props: Record<string, string>): string => {
	return Object.entries(props)
		.map(([key, value]) => `--${key}: ${value};`)
		.join(' ');
};
