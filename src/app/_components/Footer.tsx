"use client";

export default function Footer() {
  return (
    <footer className=" bg-gradient-to-b from-zinc-900 to-zinc-800">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-100">BALANSOME</h3>
            {/* <p className="text-sm text-zinc-400">
              건강한 게이밍 라이프를 위한
              <br />
              맞춤형 게이밍 기어 추천 서비스
            </p> */}
          </div>

          {/* <div className="space-y-4">
            <h3 className="font-semibold text-zinc-100">서비스</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="hover:text-zinc-200 transition-colors cursor-pointer">
                기어 추천
              </li>
              <li className="hover:text-zinc-200 transition-colors cursor-pointer">
                게이밍 설문
              </li>
              <li className="hover:text-zinc-200 transition-colors cursor-pointer">
                기어 정보
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-100">고객지원</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="hover:text-zinc-200 transition-colors cursor-pointer">
                자주 묻는 질문
              </li>
              <li className="hover:text-zinc-200 transition-colors cursor-pointer">
                1:1 문의
              </li>
              <li className="hover:text-zinc-200 transition-colors cursor-pointer">
                이용약관
              </li>
              <li className="hover:text-zinc-200 transition-colors cursor-pointer">
                개인정보처리방침
              </li>
            </ul>
          </div> */}

          <div className="space-y-4 flex flex-col items-end">
            {/* <h3 className="font-semibold text-zinc-100">Contact</h3> */}
            <ul className="space-y-2 text-sm text-zinc-400">
              {/* <li>kku98057@naver.com</li> */}
              {/* <li>서울특별시 강남구 테헤란로</li> */}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800">
          <p className="text-center text-sm text-zinc-500">
            © 2024 Balansome. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
