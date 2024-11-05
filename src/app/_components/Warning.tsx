export default function Warning({
  title = "  *음란물 등록시 임의로 삭제되며, 관련 법률에 의하여 처벌 받을 수 있습니다.",
}: {
  title?: string;
}) {
  return <p className="text-red-500">{title}</p>;
}
