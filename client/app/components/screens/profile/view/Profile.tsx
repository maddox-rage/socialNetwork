import { Card, Col, Row, Spin } from 'antd'
import { useRouter } from 'next/router'
import { FC } from 'react'

import Layout from '@/components/layout/Layout'
import ProfileAvatar from '@/components/screens/profile/view/ProfileAvatar'
import ProfileInfo from '@/components/screens/profile/view/ProfileInfo/ProfileInfo'
import ProfilePosts from '@/components/screens/profile/view/ProfilePosts'

import { IUser } from '@/types/user.interface'

import { useProfileById } from '@/hooks/useProfileById'

const Profile: FC = () => {
	const { query } = useRouter()
	const userId = query?.id

	const { isLoading, data } = useProfileById(userId)

	return (
		<Layout title={data?.name || ''}>
			<Card bordered={false} bodyStyle={{ padding: '1rem 0' }}>
				<Row gutter={[20, 20]}>
					<Col span={5}>
						{isLoading ? (
							<Spin />
						) : (
							<ProfileAvatar profile={data || ({} as IUser)} />
						)}
					</Col>
					<Col span={8}>
						{isLoading ? (
							<Spin />
						) : (
							<ProfileInfo profile={data || ({} as IUser)} />
						)}
					</Col>
					<Col span={11}>
						{isLoading ? (
							<Spin />
						) : (
							data?._id && <ProfilePosts userId={data._id} />
						)}
					</Col>
				</Row>
			</Card>
		</Layout>
	)
}

export default Profile
