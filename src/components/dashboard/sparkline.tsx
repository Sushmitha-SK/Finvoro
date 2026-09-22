type SparklineProps = {
    values: number[];
    color: string;
    className?: string;
};

/** Tiny dependency-free trend line (SVG). */
export function Sparkline({ values, color, className }: SparklineProps) {
    const width = 96;
    const height = 32;
    const pad = 2;

    if (values.length < 2) {
        return <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden />;
    }

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;

    const points = values.map((value, index) => {
        const x = pad + (index / (values.length - 1)) * (width - pad * 2);
        const y = height - pad - ((value - min) / range) * (height - pad * 2);

        return [x, y] as const;
    });

    const line = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `${line} L${points[points.length - 1][0].toFixed(1)},${height} L${points[0][0].toFixed(1)},${height} Z`;
    const [lastX, lastY] = points[points.length - 1];

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden preserveAspectRatio="none">
            <path d={area} fill={color} opacity={0.12} />
            <path d={line} fill="none" stroke={color} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={lastX} cy={lastY} r={2.5} fill={color} />
        </svg>
    );
}
