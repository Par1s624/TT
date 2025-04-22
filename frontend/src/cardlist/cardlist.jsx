import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Avatar, Card, Popconfirm, message } from 'antd';
import styled from 'styled-components';
import http from '../util/utility.js';
import { useNavigate } from 'react-router-dom';

const { Meta } = Card;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
`;

const Cardlist = ({ gameList = [], setGameList }) => {
  // 删除游戏函数
  const handleDelete = (gameId) => {
    const newGames = gameList.filter(game => game.id !== gameId);

    http.put('/admin/games', { games: newGames })
      .then(() => {
        message.success('游戏删除成功');
        setGameList(newGames);
      })
      .catch(error => {
        console.error('删除失败:', error);
        message.error('删除游戏失败');
      });
  };

  const navigate = useNavigate();

  return (
    <Container>
      {
        gameList.length > 0 ? gameList.map(game => (
          <Card
            key={game.id}
            style={{ width: 300 }}
            cover={
              <img
                alt="thumbnail"
                src={game.thumbnail}
              />
            }
            actions={[
              <EditOutlined key="edit" onClick={() => navigate(`/game/${game.id}`)} />,

              <Popconfirm
                key="delete"
                title="确认删除该游戏？"
                onConfirm={() => handleDelete(game.id)}
                okText="确认"
                cancelText="取消"
              >
                <DeleteOutlined style={{ color: 'red' }} />
              </Popconfirm>,
            ]}
          >
            <Meta
              avatar={<Avatar>{game.owner?.[0] || '?'}</Avatar>}
              title={game.name}
            />
          </Card>
        )) : <p>暂无游戏，请创建一个。</p>
      }
    </Container>
  );
};

export default Cardlist;

