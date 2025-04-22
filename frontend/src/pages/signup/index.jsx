
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

import http from '../../util/utility';  // 你自己的封装请求

export default function Signup() {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    const { email, password, name } = values;

    try {
      const res = await http.post('/admin/auth/register', { email, password, name });

      // 保存 token
      window.localStorage.setItem('token', res.token);

      // 显示成功提示
      message.success('注册成功');

      // ✅ 注册成功后跳转到 dashboard
      navigate('/dashboard');
    } catch (err) {
      // 错误会在 http 中自动处理显示 message
      console.error(err);
    }
  };
  
  return (
    <div style={{ width: 400, margin: '100px auto' }}>
      <h2 style={{ textAlign: 'center' }}>注册</h2>
      <Form
        onFinish={onFinish}
        layout="vertical"
        autoComplete="off" // 关键：防止浏览器填入旧值
      >

        <Form.Item
          label="注册邮箱"
          name="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '邮箱格式不正确' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="用户名"
          name="name"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="确认密码"
          name="confirm"
          dependencies={['password']}
          rules={[
            { required: true, message: '请确认密码' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('两次密码不一致'));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
