'use client'

export default function TetDecoration() {
  return (
    <>
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 text-white py-2 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 text-4xl animate-bounce">🎊</div>
          <div className="absolute top-0 right-1/4 text-4xl animate-bounce delay-100">🎉</div>
        </div>
        <p className="text-sm md:text-base font-semibold relative z-10">
          🧧 CHÚC MỪNG NĂM MỚI 2026 - SALE TẾT LÊN ĐẾN 50% 🧧
        </p>
      </div>

      {/* Floating Lanterns */}
      <div className="fixed top-20 left-0 w-full pointer-events-none z-40">
        <div className="relative max-w-7xl mx-auto">
          {/* Left Lantern */}
          <div className="absolute left-4 top-0 animate-swing">
            <div className="text-6xl filter drop-shadow-lg">🏮</div>
          </div>

          {/* Right Lantern */}
          <div className="absolute right-4 top-0 animate-swing-delay">
            <div className="text-6xl filter drop-shadow-lg">🏮</div>
          </div>
        </div>
      </div>

      {/* Peach Blossoms - Corner Decorations */}
      <div className="fixed bottom-0 left-0 pointer-events-none z-30 opacity-30">
        <div className="text-9xl">🌸</div>
      </div>
      <div className="fixed bottom-0 right-0 pointer-events-none z-30 opacity-30">
        <div className="text-9xl transform scale-x-[-1]">🌸</div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes swing {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes swing-delay {
          0%, 100% {
            transform: rotate(5deg);
          }
          50% {
            transform: rotate(-5deg);
          }
        }

        .animate-swing {
          animation: swing 3s ease-in-out infinite;
        }

        .animate-swing-delay {
          animation: swing-delay 3s ease-in-out infinite;
        }

        .delay-100 {
          animation-delay: 0.5s;
        }
      `}</style>
    </>
  )
}
