import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { PetModule } from './pet/pet.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { ViewModule } from './view/view.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';

import { NotificationModule } from './notification/notification.module';
import { FaqModule } from './faq/faq.module';

@Module({
	imports: [
		MemberModule,
		AuthModule,
		PetModule,
		BoardArticleModule,
		LikeModule,
		ViewModule,
		CommentModule,
		FollowModule,
		NotificationModule,
		FaqModule,
	],
})
export class ComponentsModule {}
