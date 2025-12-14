import { SpaceNavigation } from "./_navigation/space-navigation";

type LayoutProps = {
  children: React.ReactNode;
};

export default async function RouteLayout(props: LayoutProps) {
  return <SpaceNavigation>{props.children}</SpaceNavigation>;
}
