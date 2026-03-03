interface WebGPUDemoProps {
  src: string;
}

export default function WebGPUDemo({ src }: WebGPUDemoProps) {
  return (
    <div className="my-6 w-full" style={{ height: '600px' }}>
      <iframe
        className="w-full h-full rounded-lg"
        src={src}
        title="WebGPU Demo"
        allow="cross-origin-isolated"
        sandbox="allow-same-origin allow-scripts allow-forms"
        style={{ border: 'none', height: '100%' }}
      />
    </div>
  );
}
