import { Typography, Card } from 'antd'
import { useAuth } from '../context/AuthContext'

const { Title, Paragraph } = Typography

export const HomePage = () => {
  const { user } = useAuth()

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '60vh',
      padding: '20px'
    }}>
      <Card style={{ maxWidth: 600, width: '100%' }}>
        <Title level={2}>Welcome to Social App!</Title>
        <Paragraph>
          Hello, <strong>{user?.name}</strong>! You are successfully logged in.
        </Paragraph>
        <Paragraph type="secondary">
          Use the navigation above to explore the app features. Check out the Posts section to manage posts with pagination, search, and comments.
        </Paragraph>
      </Card>
    </div>
  )
}