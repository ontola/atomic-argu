type VisibleResult = {
	destroy: () => void;
};

export const visible = (
	node: HTMLElement,
	{ root, onVisibleChange }: { root: HTMLElement; onVisibleChange: (isVisible: boolean) => void }
): VisibleResult => {
	console.log('setup visible');
	const observer = new IntersectionObserver(
		(entries) => {
			console.log('entries', entries);
			const isIntersecting = entries.some((entry) => entry.isIntersecting);
			onVisibleChange(isIntersecting);
		},
		{
			root,
			threshold: 0.4
		}
	);

	observer.observe(node);

	return {
		destroy: () => observer.disconnect()
	};
};
