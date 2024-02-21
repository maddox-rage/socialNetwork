import { Card, List } from 'antd'
import { useRouter } from 'next/router'

import ListItem from '@/components/layout/sidebar/ListItem'

import styles from './Sidebar.module.scss'
import { menu } from './dataMenu'

const Menu = () => {
	const { push } = useRouter()

	return (
		<Card className={styles.card}>
			<List itemLayout='vertical'>
				{menu.map(item => (
					<ListItem key={item.link} item={item} />
				))}
			</List>
		</Card>
	)
}

export default Menu
