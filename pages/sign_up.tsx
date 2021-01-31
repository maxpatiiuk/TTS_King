import Layout         from '../components/Layout';
import { PublicMenu } from '../components/PublicMenu';
import Link           from 'next/Link';
import { Centered }   from '../components/UI';

const Home = () =>
	<Layout>
		<PublicMenu />
		<Centered>1</Centered>
	</Layout>;

export default Home;
