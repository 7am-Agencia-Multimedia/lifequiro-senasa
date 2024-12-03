import React, { useEffect, useState } from 'react';
import { Avatar, Button, List, Skeleton } from 'antd';

// Importar el archivo JSON localmente
import usersData from '@/utils/FakeUser.json';

interface DataType {
    gender?: string;
    name: {
        first?: string;
        last?: string;
    };
    email?: string;
    picture: {
        large?: string;
    };
    nat?: string;
    loading: boolean;
}

const count = 3; 

const ListUsers: React.FC = () => {
    const [initLoading, setInitLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataType[]>(usersData); // Usar directamente el archivo importado
    const [list, setList] = useState<DataType[]>(data.slice(0, count)); // Usar los mismos datos de inicio para la lista

    // useEffect(() => {
    //     async function handleGetUserList() {
    //         try {
    //             const { data: res } = await axios.request({
    //                 method: 'GET',
    //                 url: '/api/services/get',
    //             });
    //             setInitLoading(false);
    //             setData(res.users);
    //             setList(res.users);
    //         } catch (error) {
    //             console.error(error);
    //             setInitLoading(false);
    //         }
    //     }
    //     handleGetUserList();
    // }, []);

    const onLoadMore = () => {
        setLoading(true);
        setList(
            data.concat([...new Array(count)].map(() => ({ loading: true, name: {}, picture: {} }))),
        );
        // Aquí, simplemente agregamos los mismos datos de nuevo para simular la carga de más usuarios
        setTimeout(() => {
            setLoading(false);
            setList(data.slice(0, list.length + count));
        }, 1000);
    };

    const loadMore =
        !initLoading && !loading && list.length < data.length ? (
            <div
                style={{
                    textAlign: 'center',
                    marginTop: 12,
                    height: 32,
                    lineHeight: '32px',
                }}
            >
                <Button onClick={onLoadMore}>Cargar más</Button>
            </div>
        ) : null;

    return (
        <List
            className="demo-loadmore-list"
            loading={initLoading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            // header={
            // <div className='grid grid-cols-4'>
            //     <p>A</p>
            //     <p>b</p>
            //     <p>c</p>
            // </div>
            // } 
            renderItem={(item) => (
                <List.Item
                    actions={[<a key="list-loadmore-edit">editar</a>, <a key="list-loadmore-more">más</a>, <a key="list-loadmore-ads">más</a>]}
                >
                    <Skeleton avatar title={false} loading={item.loading} active>
                        <List.Item.Meta
                            avatar={<Avatar src={item.picture.large} />}
                            title={<a href="https://ant.design">{item.name?.last}</a>}
                            description={item.email}
                        />
                        <div>{item.nat}</div>
                    </Skeleton>
                </List.Item>
            )}
        />
    );
};

export default ListUsers;
