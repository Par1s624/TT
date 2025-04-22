import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
  UploadOutlined
} from '@ant-design/icons';
import {
  Avatar,
  Button,
  Card,
  Layout,
  message,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Upload
} from 'antd';
import http, { isLogin, fileToDataUrl } from '../../util/utility';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Cardlist from '../../cardlist/cardlist.jsx';

const { Header, Content } = Layout;
const { Meta } = Card;
const { Text } = Typography;

export default function Dashboard() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  const [form] = Form.useForm();

  useEffect(() => {
    const logined = isLogin();
    if (!logined) {
      message.warning('未检测到登录，为您重定向到登录页面', 5, () => {
        navigate('/login');
      });
    } else {
      const email = window.localStorage.getItem('email') || 'User';
      setUserEmail(email);

      // 新增：加载游戏列表
      http.get('/admin/games').then(res => {
        setGameList(res.games || []);
      });
    }
  }, []);

  const handleLogout = () => {
    http.post('/admin/auth/logout').then((res) => {
      if (res) {
        message.success('已登出');
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('email');
        navigate('/login');
      }
    });
  };

  const [gameList, setGameList] = useState([]);

  
  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields();
      const owner = window.localStorage.getItem('email');
      if (!owner) throw new Error('用户未登录');
  
      const gameId = Date.now();
  
      const res = await http.get('/admin/games');
      const existingGames = res.games || [];
  
      const newGame = {
        id: gameId,
        name: values.name,
        owner,
        thumbnail: thumbnail || '',
        description: values.description || '',
        questions: [],
      };
      newGame.questions = [];
      const payload = {
        games: [...existingGames, newGame],
      };
  
      await http.put('/admin/games', payload);
      setGameList([...existingGames, newGame]);
  
      message.success('游戏创建成功');
      setIsModalOpen(false);
      form.resetFields();
      setThumbnail(null);
    } catch (err) {
      console.error(err);
      message.error(err.message || '创建游戏失败');
    }
  };
  
  const beforeUpload = async (file) => {
    try {
      const dataUrl = await fileToDataUrl(file);
      setThumbnail(dataUrl);
    } catch (err) {
      message.error(err.message);
    }
    return false; // 防止 Upload 自动上传
  };

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px'
        }}
      >
        <Text strong>Welcome, {userEmail}</Text>
        <Space>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Create Game
          </Button>
          <Button danger onClick={handleLogout}>
            Logout
          </Button>
        </Space>
      </Header>

      <contentArea>
        <Cardlist gameList={gameList} setGameList={setGameList} />
      </contentArea>

      {/* 创建游戏弹窗 */}
      <Modal
        title="创建新游戏"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleModalSubmit}
        okText="创建"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="缩略图 (可选)">
            <Upload
              listType="picture-card"
              showUploadList={false}
              beforeUpload={beforeUpload}
            >
              {thumbnail ? <img src={thumbnail} alt="thumbnail" style={{ width: '100%' }} /> : <UploadOutlined />}
            </Upload>
          </Form.Item>

          <Form.Item
            name="name"
            label="游戏名称"
            rules={[{ required: true, message: '请输入游戏名称' }]}
          >
            <Input placeholder="请输入游戏名称" />
          </Form.Item>

          <Form.Item name="description" label="游戏描述 (可选)">
            <Input.TextArea rows={4} placeholder="请输入游戏描述" />
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}