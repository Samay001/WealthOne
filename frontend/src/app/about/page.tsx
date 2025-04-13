import Image from "next/image";

export default function About() {
  return (
    <div className="min-h-screen bg-[#00031C] text-white overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[150px] translate-y-1/3 -translate-x-1/4"></div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(#2d2d6d 1px, transparent 1px), linear-gradient(90deg, #2d2d6d 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* About Us header with decorative lines */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            <h2 className="text-xl font-medium text-blue-400 tracking-wide">
              About Us
            </h2>
            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          </div>

          {/* Main heading */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
              Wealth One is a sleek, AI-powered finance dashboard that helps
              users track total wealth, investments, and available funds all in
              one responsive and intuitive interface.
            </h1>
          </div>

          {/* Features section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                iconBg: "from-orange-500 to-red-500",
                title: "AI-Powered Insights",
                text: "Harness AI to analyze trends, predict growth, and boost financial decision-making.",
                svgPath: "M13 10V3L4 14h7v7l9-11h-7z",
              },
              {
                iconBg: "from-green-500 to-emerald-600",
                title: "Smart Wealth Tracking",
                text: "Monitor assets, investments, and liquidity in real-time with intelligent syncing.",
                svgPath:
                  "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
              },
              {
                iconBg: "from-blue-500 to-indigo-600",
                title: "Automated Optimization",
                text: "Streamline personal finance with automated calculations and portfolio balancing.",
                svgPath:
                  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-[#0f172a]/70 rounded-lg p-6 shadow-md"
              >
                <div
                  className={`w-12 h-12 mb-4 rounded-full flex items-center justify-center text-white bg-gradient-to-br ${feature.iconBg}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={feature.svgPath}
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.text}</p>
              </div>
            ))}
          </div>

          {/* Dashboard Preview */}
          <div className="relative mt-20 group">
            {/* Gradient border glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-10 group-hover:opacity-40 transition duration-1000"></div>

            {/* Image container with brightness */}
            <div className="relative rounded-xl overflow-hidden border border-slate-800/50 shadow-2xl shadow-blue-900/20 transform group-hover:scale-[1.01] transition duration-500">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xtlnhq1FKT9eljbJPPuhpibuyqAA8b.png"
                alt="Wealth Dashboard"
                width={1200}
                height={800}
                className="w-full h-auto filter brightness-170"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a20]/80 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
