import {useState, useEffect} from 'react'
import { FiTrash2 } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { MdShoppingCart, MdLocalMall } from 'react-icons/md'

interface Comment { // tipo de dado
    id: number;
    title: string;
    content: string;
    published: boolean;
    likesQty: number;
  }

const Comment = () => {
    const [title, setTitle] = useState(''); // variável do formulário
    const [content, setContent] = useState(''); // variável do formulário
    const [likesQty, setLikesQty] = useState(0); // variável do formulário
    const [published, setPublished] = useState(1); // variável do formulário

  // variável que guarda todos os produtos
    const [comments, setComments] = useState<Comment[]>([]);
    //  vai nos permitir recuperar o userId passado do Login para o Produto
    const location = useLocation();
    // efetivamente recupera o userId a partir do estado
    const userId = location.state?.userId || '';

    useEffect(() => {
        const fetchComments = async () => {
          try {
            const response = await fetch(`http://localhost:3333/products/${userId}`);
            const data = await response.json();

            if (response.ok) {
              setComments(data);
            } else {
              console.error('Failed to fetch products');
            }
          } catch (error) {
            console.error('Error:', error);
          }
        };

        fetchComments();
      }, [userId]);

      useEffect(() => {
        setComments(comments);
      }, [comments]);

      // cria um produto no banco de dados e atualiza a lista de produtos
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const commentData = { // tipo de dados para enviar ao backend
          title,
          content,
          published,
          likesQty,
        };

        try {
          const newComment = await fetch('http://localhost:3333/comment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(commentData),
          })
          .then (resp => {
            return resp.json()
          })

           // Limpar os campos do formulário
            setTitle('');
            setContent('');
            setLikesQty(0);
            setPublished(1);

            //atualiza lista de comentario com o novo comentario
            setComments((prevCommentList) => [...prevCommentList, newComment]);

        } catch (error) {
          console.error('Error:', error);
        }
      };

      const handleRemoveComment = async (id: Number) => {

        // Lógica para fazer a requisição DELETE para a rota /comment/:id
        // Utilize o userId e productId para formar a URL correta

        // Exemplo de requisição DELETE utilizando fetch:
       await fetch(`http://localhost:3333/comment/${id}`, {
          method: 'DELETE',
        })
          .then(response => {
            return response.json()
        })
          .catch(error => {
            alert(error)
          });

        // atualiza lista de comentario, retirando o produto desejado
        setComments(comments.filter((comment) => comment.id !== id));
      };

      const handleAddComment = async (id: Number) => {
        // Lógica para fazer a requisição ATUALIZAÇAO para a rota /produto/:id
        // Utilize o userId e productId para formar a URL correta
        const title = String(prompt('Informe o titulo do comentário'))
        const content = String(prompt('Informe o que terá no comentário'))
        const likesQty = Number(prompt('Informe qtde de likes'))
        const published = Boolean(prompt('Informe se está ou não publicado'))
        const addData = {
            id,
            userId,
            title,
            content,
            likesQty,
            published,
          };

        // Exemplo de requisição PATCH utilizando fetch:
       const newComment = await fetch(`http://localhost:3333/comment/increase-comment`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(addData),
        })
        .then(response => {
            return response.json()
        })
          .catch(error => {
            alert(error)
          });

        // Encontre o índice do produto atualizado na lista
        const index = comments.findIndex((comment) => comment.id === newComment.id);
        if (index !== -1) {
          setComments((prevCommentList) => {
              const newCommentList = [...prevCommentList];
              newCommentList[index] = newComment;
              return newCommentList;
        });
        }
      };

    const [publishedComment, setCommentSwitch] = useState(false);
    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen">
          <div className="max-w-md mx-auto">
            {/* inicia o formulário para cadastrar um produto */ }
             <form onSubmit={handleSubmit} className="max-w-md mx-auto mb-4">
              <div>
            <label htmlFor="title" className="block font-semibold">
              Titulo:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="content" className="block font-semibold">
              Comentário:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="likesQty" className="block font-semibold">
              Quantidade de likes:
            </label>
            <input
              type="number"
              id="likesQty"
              value={likesQty}
              onChange={(e) => setLikesQty(Number(e.target.value))}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="likesQty" className="block font-semibold">
              Status:
            </label>
            <div className="relative inline-block w-10 mr-2 align-middle select-none">
            <input
              type="checkbox"
              id="published"
              checked={!!published}
              className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
            />

              <label
                htmlFor="published"
                className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer">
              </label>
            </div>

            <label htmlFor="published" className="text-xs text-gray-700">
              {published ? 'Habilitado' : 'Desabilitado'}
            </label>

          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-blue-600"
          >
            Comentar
          </button>
        </form>
{/* inicia a tabela para listar os produtos */ }
        <div className="max-w-md mx-auto mb-4">
      <h2 className="text-2xl font-bold mb-4">Lista de Produtos</h2>
      <table className="w-full border border-gray-300">
        <thead>
          <tr>
            <th className="border-b border-gray-300 py-2 px-4">Titulo</th>
            <th className="border-b border-gray-300 py-2 px-4">Comentário</th>
            <th className="border-b border-gray-300 py-2 px-4">Quantidade de Likes</th>
            <th className="border-b border-gray-300 py-2 px-4">Status</th>
            <th className="border-b border-gray-300 py-2 px-4">Remove</th>
            <th className="border-b border-gray-300 py-2 px-4">Like</th>
            <th className="border-b border-gray-300 py-2 px-4">Tirar Like</th>
          </tr>
        </thead>
        <tbody>
          {/* percorre a lista de produtos */}
          {comments.map((comment) => (
            <tr key={comment.id}>
              <td className="border-b border-gray-300 py-2 px-4">{comment.title}</td>
              <td className="border-b border-gray-300 py-2 px-4">{comment.content}</td>
              <td className="border-b border-gray-300 py-2 px-4">{comment.likesQty}</td>
              <td className="border-b border-gray-300 py-2 px-4">{comment.published}</td>
              <td className="border-b border-gray-300 py-2 px-4">
                <button
                  onClick={() => handleRemoveComment(comment.id)}
                  className="flex items-center justify-center p-2 text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={20} />
                </button>
              </td>
              <td className="border-b border-gray-300 py-2 px-4">
                <button onClick={() => handleAddComment(comment.id)} className="flex items-center justify-center p-2 text-green-500 hover:text-green-700">
                <MdShoppingCart size={20}/>
                </button>
              </td>
              <td className="border-b border-gray-300 py-2 px-4">
                <button className="flex items-center justify-center p-2 text-green-500 hover:text-green-700">
                  <MdLocalMall size={20}/>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

      </div>
</div>



    )
}

export default Comment