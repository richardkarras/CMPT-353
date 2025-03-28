const Post = ({id,topic,data}) => {
  return (
    <div className="post">
      <h2>{id}</h2>
      <h3>{topic}</h3>
      <p>{data}</p>
    </div>
  );
};

  export default Post;