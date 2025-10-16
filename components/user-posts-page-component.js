import { renderHeaderComponent } from './header-component.js'
import { posts, goToPage } from '../index.js'
import { POSTS_PAGE } from '../routes.js'
//import { formatDistanceToNow } from "https://esm.sh/date-fns";
//import { ru } from 'https://esm.sh/date-fns/locale';
//import { formatDistanceToNow } from "https://cdn.skypack.dev/date-fns"
//import { ru } from "https://cdn.skypack.dev/date-fns/locale"
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'

export function renderUserPostsPageComponent({ appEl, userId }) {
    //Получаем пользователя
    const userPosts = posts.filter((post) => post.user.id === userId)
    const user =
        userPosts.length > 0
            ? userPosts[0].user
            : { name: 'Пользователь', imageUrl: '' }

    const appHtml = `
        <div class='page-container'>
            <div class='header-container'></div>
            <div class='posts-header'>
                <div class='posts-header__user-info'>                    
                    <img src="${user.imageUrl}" class="posts-header__user-image" alt='фото поста'>
                    <p class='posts-header__user-name'>${user.name}<>/p>                    
                </div>
                <button class='button' id='back-button'>Назад</button>
            </div>
            <div class='posts-container'>
                ${
                    userPosts.length === 0
                        ? '<p class="no-posts">У пользователя пока нет постов</p>'
                        : `
                    <ul class="posts">
                    ${generatePostsHtml(userPosts)}
                    </ul>
                    `
                }
            </div>
        </div>      
    `

    appEl.innerHTML = appHtml

    // Рендерим заголовок страницы
    renderHeaderComponent({
        element: document.querySelector('.header-container'),
    })

    // Обработчик кнопки "Назад"
    document.getElementById('back-button').addEventListener('click', () => {
        goToPage(POSTS_PAGE)
    })

    // Обработчики для лайков
    initEventListeners()
}

//Передаём posts как параметр

function generatePostsHtml(posts) {
    return posts
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
            <img src="${post.user.imageUrl}" class="post-header__user-image alt="фото профиля пользователя">
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
