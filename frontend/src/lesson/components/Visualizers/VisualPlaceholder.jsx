export default function VisualPlaceholder({ visualizer, action, payload }) {
	return (
		<div className="visual-placeholder">
			<h3>Visualization Placeholder</h3>
			<div className="visual-field">
				<span>Visualizer:</span>
				<strong>{visualizer || "unknown"}</strong>
			</div>
			<div className="visual-field">
				<span>Action:</span>
				<strong>{action || "none"}</strong>
			</div>
			<div className="visual-payload">
				<span>Payload:</span>
				<pre>{JSON.stringify(payload || {}, null, 2)}</pre>
			</div>
		</div>
	);
}
