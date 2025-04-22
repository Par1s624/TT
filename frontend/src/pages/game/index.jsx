import {
  Layout,
  Button,
  Typography,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message
} from 'antd';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import http from '../../util/utility';

const { Header} = Layout;
const { Title } = Typography;
const { Option } = Select;

export default function Game() {
  const [game, setGame] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const params = useParams();
  const navigate = useNavigate();


  useEffect(() => {
    http.get('/admin/games').then(data => {
      const allGames = data.games || [];
      const gameId = parseInt(params.game_id); // 一定注意要转成数字
      const found = allGames.find(game => game.id === gameId);
      
      if (found) {
        setGame(found);
      } else {
        message.error('找不到该游戏');
      }
    });
  }, [params.game_id]);
  
  
  const handleAddQuestion = async () => {
    try {
      const values = await form.validateFields();

      const newQuestion = {
        id: Date.now(),
        title: values.title,
        type: values.type,
        options: [],
        answer: null,
        points: 0,
        timeLimit: 30
      };

      const updatedGame = {
        ...game,
        questions: [...(game.questions || []), newQuestion]
      };

      const res = await http.get('/admin/games');
      const existingGames = res.games || [];

      const updatedGames = existingGames.map(g =>
        g.id === game.id ? updatedGame : g
      );

      await http.put('/admin/games', { games: updatedGames });

      message.success('问题创建成功');
      setGame(updatedGame);
      setIsModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error('问题创建失败');
    }
  };

  return (
    <Layout>
      <Header
        style={{
          backgroundColor: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px',
          borderBottom: '1px solid #eee',
        }}
      >
        <Button type="link" onClick={() => navigate('/dashboard')}>
          返回 Dashboard
        </Button>

        <Title level={4} style={{ margin: 0 }}>
          {game?.name || '--'}
        </Title>

        <Space>
          <Button onClick={() => message.info('点击了编辑游戏信息')}>编辑游戏信息</Button>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            添加问题
          </Button>
        </Space>
      </Header>

      <Title level={5}>问题列表</Title>
      {
        game?.questions?.length > 0 ? (
          game.questions.map((q, index) => (
            <div
              key={q.id}
              style={{
                border: '1px solid #eee',
                borderRadius: 6,
                padding: '16px',
                marginBottom: '16px',
                backgroundColor: '#fff',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 'bold' }}>问题 {index + 1}：{q.title}</div>
                <Space>
                  <Button
                    icon={<EditOutlined />}
                    type="default"
                    size="small"
                    onClick={() => message.info(`编辑问题 ${q.title}`)}
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    type="default"
                    size="small"
                    danger
                    onClick={() => {
                      const updatedQuestions = game.questions.filter((question) => question.id !== q.id);
                      const updatedGame = { ...game, questions: updatedQuestions };

                      http.get('/admin/games').then(res => {
                        const updatedGames = res.games.map(g =>
                          g.id === game.id ? updatedGame : g
                        );
                        http.put('/admin/games', { games: updatedGames }).then(() => {
                          message.success('问题删除成功');
                          setGame(updatedGame);
                        });
                      });
                    }}
                  />

                </Space>
              </div>
              <div style={{ marginTop: 8, color: '#888' }}>类型：{q.type === 'single' ? '单选题' : q.type === 'multiple' ? '多选题' : '判断题'}</div>
            </div>
          ))
        ) : (
          <p style={{ color: '#999' }}>暂无问题，请添加一个。</p>
        )
      }



      {/* 添加问题弹窗 */}
      <Modal
        title="添加新问题"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAddQuestion}
        okText="创建问题"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="title"
            label="问题标题"
            rules={[{ required: true, message: '请输入问题标题' }]}
          >
            <Input placeholder="请输入问题标题" />
          </Form.Item>

          <Form.Item
            name="type"
            label="问题类型"
            rules={[{ required: true, message: '请选择问题类型' }]}
          >
            <Select placeholder="请选择类型">
              <Option value="single">单选题</Option>
              <Option value="multiple">多选题</Option>
              <Option value="boolean">判断题</Option>
            </Select>
          </Form.Item>

          <p style={{ color: '#888', fontSize: 12 }}>
            创建问题后，您可以点击问题卡片进入详细编辑页面设置时间限制、分值和答案选项等。
          </p>
        </Form>
      </Modal>
    </Layout>
  );
}
