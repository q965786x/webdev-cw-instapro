import { USER_POSTS_PAGE } from '../routes.js'
import { renderHeaderComponent } from './header-component.js'
import { posts, goToPage, user, getToken } from '../index.js'
import { dislikePost, likePost } from '../api.js'
import { renderApp } from '../index.js'
//import { formatDistanceToNow } from "https://esm.sh/date-fns";
//import { ru } from 'https://esm.sh/date-fns/locale';
//import { formatDistanceToNow } from "https://cdn.skypack.dev/date-fns"
//import { ru } from "https://cdn.skypack.dev/date-fns/locale"
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export function renderPostsPageComponent({ appEl }) {
    // @TODO: реализовать рендер постов из api
    //console.log("Актуальный список постов:", posts);

    /**
     * @TODO: чтобы отформатировать дату создания поста в виде "19 минут назад"
     * можно использовать https://date-fns.org/v2.29.3/docs/formatDistanceToNow
     */

    const postsHtml = posts
        .map((post) => {
            const isLiked = post.isLiked
            const likeButtonImg = isLiked
                ? './assets/images/like-active.svg'
                : './assets/images/like-not-active.svg'

            const postDate = formatDistanceToNow(new Date(post.createdAt), {
                locale: ru,
            })

            return `
      <li class="post" data-post-id="${post.id}">
        <div class="post-header" data-user-id=${post.user.id}>
            <img src="${post.user.imageUrl}" class="post-header__user-image alt="фото профиля пользователя"
            <p class="post-header__user-name">${post.user.name}</p>
        </div>
        <div class="post-image-container">
          <img class="post-image" src="${post.imageUrl}" alt="фото поста">
        </div>
        <div class="post-likes">
          <button data-post-id="${post.id}" class="like-button">
            <img src="${likeButtonImg}">
          </button>
          <p class="post-likes-text">
            Нравится: <strong>${post.likes.length}</strong>
          </p>
        </div>
        <p class="post-text">
          <span class="user-name">${post.user.name}</span>
          ${post.description}
        </p>
        <p class="post-date">
         ${postDate}
        </p>
      </li>
    `
        })
        .join('')

    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <ul class="posts">
        ${postsHtml}
      </ul>
    </div>`

    appEl.innerHTML = appHtml

    /*const appHtml = `
              <div class="page-container">
                <div class="header-container"></div>
                <ul class="posts">
                  <li class="post">
                    <div class="post-header" data-user-id="642d00329b190443860c2f31">
                        <img src="https://www.imgonline.com.ua/examples/bee-on-daisy.jpg" class="post-header__user-image">
                        <p class="post-header__user-name">Иван Иваныч</p>
                    </div>
                    <div class="post-image-container">
                      <img class="post-image" src="https://www.imgonline.com.ua/examples/bee-on-daisy.jpg">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="642d00579b190443860c2f32" class="like-button">
                        <img src="./assets/images/like-active.svg">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>2</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">Иван Иваныч</span>
                      Ромашка, ромашка...
                    </p>
                    <p class="post-date">
                      19 минут назад
                    </p>
                  </li>
                  <li class="post">
                    <div class="post-header" data-user-id="6425602ce156b600f7858df2">
                        <img src="https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680601502867-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-04-04%2520%25C3%2590%25C2%25B2%252014.04.29.png" class="post-header__user-image">
                        <p class="post-header__user-name">Варварва Н.</p>
                    </div>
                  
                    
                    <div class="post-image-container">
                      <img class="post-image" src="https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680670675451-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-03-31%2520%25C3%2590%25C2%25B2%252012.51.20.png">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="642cffed9b190443860c2f30" class="like-button">
                        <img src="./assets/images/like-not-active.svg">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>35</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">Варварва Н.</span>
                      Нарисовала картину, посмотрите какая красивая
                    </p>
                    <p class="post-date">
                      3 часа назад
                    </p>
                  </li>
                  <li class="post">
                    <div class="post-header" data-user-id="6425602ce156b600f7858df2">
                        <img src="https://storage.yandexcloud.net/skypro-webdev-homework-bucket/1680601502867-%25C3%2590%25C2%25A1%25C3%2590%25C2%25BD%25C3%2590%25C2%25B8%25C3%2590%25C2%25BC%25C3%2590%25C2%25BE%25C3%2590%25C2%25BA%2520%25C3%2591%25C2%258D%25C3%2590%25C2%25BA%25C3%2591%25C2%2580%25C3%2590%25C2%25B0%25C3%2590%25C2%25BD%25C3%2590%25C2%25B0%25202023-04-04%2520%25C3%2590%25C2%25B2%252014.04.29.png" class="post-header__user-image">
                        <p class="post-header__user-name">Варварва Н.</p>
                    </div>
                  
                    
                    <div class="post-image-container">
                      <img class="post-image" src="https://leonardo.osnova.io/97a160ca-76b6-5cba-87c6-84ef29136bb3/">
                    </div>
                    <div class="post-likes">
                      <button data-post-id="642cf82e9b190443860c2f2b" class="like-button">
                        <img src="./assets/images/like-not-active.svg">
                      </button>
                      <p class="post-likes-text">
                        Нравится: <strong>0</strong>
                      </p>
                    </div>
                    <p class="post-text">
                      <span class="user-name">Варварва Н.</span>
                      Голова
                    </p>
                    <p class="post-date">
                      8 дней назад
                    </p>
                  </li>
                </ul>
              </div>`;*/

    // Рендерим заголовок страницы
    renderHeaderComponent({
        element: document.querySelector('.header-container'),
    })

    for (let userEl of document.querySelectorAll('.post-header')) {
        userEl.addEventListener('click', () => {
            goToPage(USER_POSTS_PAGE, {
                userId: userEl.dataset.userId,
            })
        })
    }

    // Добавляем обработчики событий для кликов по пользователям
    initEventListeners()
}

function initEventListeners() {
    // Обработчики для лайков
    document.querySelectorAll('.like-button').forEach((button) => {
        button.addEventListener('click', () => {
            const postId = button.dataset.postId
            //console.log('Like clicked for post:', postId);
            // Здесь будет логика для обработки лайков
            const post = posts.find((p) => p.id === postId)

            if (!post) return

            if (post.isLiked) {
                //Дизлайк
                dislikePost({ token: getToken(), postId })
                    .then(() => {
                        //Обновляем состояние поста
                        post.isLiked = false
                        post.likes = post.likes.filter(
                            (like) => like.id !== user.id,
                        )
                        renderApp()
                    })
                    .catch((error) => {
                        console.error('Ошибка при дизлайке:', error)
                    })
            } else {
                //Лайк
                likePost({ token: getToken(), postId })
                    .then(() => {
                        //Обновляем состояние поста
                        post.isLiked = true
                        post.likes.push(user)
                        renderApp()
                    })
                    .catch((error) => {
                        console.error('Ошибка при лайке:', error)
                    })
            }
        })
    })

    // Обработчики для кликов по пользователям
    document.querySelectorAll('.post-header').forEach((header) => {
        header.addEventListener('click', () => {
            const userId = header.dataset.userId
            goToPage(USER_POSTS_PAGE, { userId })
        })
    })
}
