import { motion } from "framer-motion";
import Container from "../Container";

export default function GameUseCaseSection() {
  return (
    <section className="">
      <Container>
        <h2 className="text-3xl font-bold text-white mb-12 text-center">
          이용 방법
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: 1,
              title: "게임 생성",
              desc: "나만의 다양한 게임을 만들어보세요",
              icon: "✏️",
            },
            {
              step: 2,
              title: "이미지 업로드",
              desc: "선택지에 맞는 이미지를 추가하세요",
              icon: "🖼️",
            },
            {
              step: 3,
              title: "공유하기",
              desc: "친구들과 함께 게임을 공유해보세요",
              icon: "📤",
            },
            {
              step: 4,
              title: "결과 확인",
              desc: "다른 사람들의 선택을 확인해보세요",
              icon: "📊",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="relative p-6 bg-zinc-800/50 rounded-xl"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                {item.step}
              </div>
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {item.title}
              </h3>
              <p className="text-zinc-400">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
