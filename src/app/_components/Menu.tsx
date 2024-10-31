export default function Menu() {
  return (
    <button
      className="w-[32px] h-[28px] flex flex-col gap-[5px] justify-between"
      type="button"
    >
      <div className="w-full bg-black rounded-e-full h-[3px]"></div>
      <div className="w-[80%] bg-black rounded-e-full h-[3px]"></div>
      <div className="w-[50%] bg-black rounded-e-full h-[3px]"></div>
    </button>
  );
}
