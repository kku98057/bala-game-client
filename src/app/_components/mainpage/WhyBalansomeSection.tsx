import { motion } from "framer-motion";
import Container from "../Container";

export default function WhyBalansomeSection() {
  return (
    <section className="py-20">
      <Container>
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          왜 Balansome인가요?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: "🎯",
              title: "맞춤형 게임 생성",
              description:
                "다양한 주제와 형식으로 자유롭게 게임을 만들 수 있습니다. 당신만의 독특한 아이디어를 실현해보세요.",
              color: "from-purple-500 to-indigo-500",
            },
            {
              icon: "🔒",
              title: "안전한 커뮤니티",
              description:
                "철저한 모니터링과 신고 시스템으로 건전한 게임 환경을 제공합니다. 누구나 안심하고 즐길 수 있습니다.",
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: "📊",
              title: "실시간 통계",
              description:
                "게임 참여자들의 선택을 실시간으로 확인할 수 있습니다. 재미있는 인사이트를 발견해보세요.",
              color: "from-green-500 to-emerald-500",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="relative overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="p-8 bg-zinc-800/50 rounded-2xl hover:bg-zinc-800/70 transition-all duration-300 h-full">
                {/* 배경 그라데이션 효과 */}
                <div
                  className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${feature.color}`}
                />

                <div className="text-4xl mb-6">{feature.icon}</div>

                <h3 className="text-xl font-semibold text-white mb-4">
                  {feature.title}
                </h3>

                <p className="text-zinc-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 추가 설명 섹션 */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Balansome은 단순한 게임을 넘어,
            <span className="text-indigo-400"> 새로운 소통의 방식</span>을
            제안합니다.
            <br />
            친구들과 함께 재미있는 순간을 만들어보세요.
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
