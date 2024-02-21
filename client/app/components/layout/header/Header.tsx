import React, { FC } from 'react'
import Search from '@/components/layout/header/Search/Search'
import styles from './Header.module.scss'

const Header: FC = () => {
	return (
		<header className={styles.header}>
			<div className={styles['image-wrapper']}>
			</div>
			<Search />
		</header>
	)
}

export default Header
