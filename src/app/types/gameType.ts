export type GameProps = {
  name: string;
  imageUrl: string;
  id: number;
};
export interface BalanceGameProps {
  title: string;
  items: GameProps[];
  totalUsers: number;
}
