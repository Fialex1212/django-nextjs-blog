import css from "./styles.module.css"
import PostList from "@/coponents/Home/PostList/PostList"

const page = () => {
  return (
    <section className={css.home}>
      <div className="container">
        <PostList />
      </div>
    </section>
  )
}

export default page

