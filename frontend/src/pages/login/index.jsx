import { Form, Input, Button, message } from 'antd';
import http from '../../util/utility';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password } = values;
    try {
      const res = await http.post('/admin/auth/login', { email, password });
      if (!res || !res.token) {
        throw new Error('登录失败');
      }
      window.localStorage.setItem('token', res.token);
      window.localStorage.setItem('email', email);
      message.success('登录成功');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
    }    
  };

  return (
    <>
      <Form
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item name="email" label="邮箱" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="密码" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form>

      {/* 🔗 注册跳转链接 */}
      <div style={{ marginTop: '16px' }}>
        还没有账号？<Link to="/signup">点此注册</Link>
      </div>
    </>
  );
}

