import { Form, Input, Button, Card, Typography, message, Space } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'
import '../styles/LoginPage.css'

const { Title, Text } = Typography

interface LoginFormValues {
  email: string
  password: string
}

export const LoginPage = () => {
  const [form] = Form.useForm()
  const { loading, signIn } = useAuth()

  const onFinish = async (values: LoginFormValues) => {
    try {
      await signIn(values.email, values.password)
      message.success('Login successful!')
    } catch (error) {
      message.error('Invalid email or password. Please try again.')
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2} className="login-title">
              Welcome Back
            </Title>
            <Text type="secondary" className="login-subtitle">
              Sign in to continue to your account
            </Text>
          </div>

          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter your email"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Enter your password"
                disabled={loading}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                className="login-button"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  )
}
