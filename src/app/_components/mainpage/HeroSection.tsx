"use client";
import { useEffect, useRef, useState } from "react";
import CustomLink from "../buttons/CustomLink";
import { motion } from "framer-motion";
import gsap from "gsap";
import Container from "../Container";
export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    // GSAP 애니메이션
    if (featuresRef.current) {
      const features = featuresRef.current.children;
      gsap.fromTo(
        features,
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top center+=100",
            toggleActions: "play none none reverse",
          },
        }
      );
    }
  }, []);
  if (!mounted) return null;
  return (
    <section className="">
      <Container>
        {/* 히어로 섹션 - Framer Motion 사용 */}
        <div className="text-center space-y-8 mb-20">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              type: "spring",
              stiffness: 100,
            }}
          >
            당신의 선택은?
            <br />
            <span className="text-indigo-400">밸런스 게임</span>
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            재미있는 밸런스 게임을 만들고 공유해보세요.
            <br />
            친구들과 함께 즐기는 선택의 순간!
          </motion.p>

          {/* 버튼 그룹 - GSAP hover 효과 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <CustomLink
              href="/balanceGame/create"
              variant="primary"
              icon="plus"
              iconPosition="left"
            >
              게임 만들기
            </CustomLink>

            <CustomLink
              href="/balanceGame"
              variant="secondary"
              icon="arrow"
              iconPosition="right"
            >
              {" "}
              게임 목록 보기
            </CustomLink>
          </motion.div>
        </div>

        {/* 특징 섹션 - GSAP 사용 */}
        <div
          ref={featuresRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {[
            {
              icon: "🎮",
              title: "쉽고 재미있게",
              description: "간단한 클릭만으로 밸런스 게임을 즐겨보세요",
            },
            {
              icon: "🎨",
              title: "직접 만들기",
              description: "나만의 독특한 밸런스 게임을 만들어보세요",
            },
            {
              icon: "🤝",
              title: "함께 즐기기",
              description: "친구들과 함께 재미있는 선택의 순간을 공유하세요",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="feature-card p-6 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-zinc-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
