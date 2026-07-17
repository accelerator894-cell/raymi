/** 全局 CRT 效果：扫描线 + 暗角 + 移动光束 */
export function Overlays() {
  return (
    <>
      <div className="scanlines-overlay" aria-hidden />
      <div className="crt-vignette" aria-hidden />
      <div className="scan-beam" aria-hidden />
    </>
  );
}
