import { Module } from '@nestjs/common';
import { RouterModule, Routes } from '@nestjs/core';
import { SupportRequestsModule } from './support-requests/support-requests.module';
import { FormSubmissionsModule } from './form-submissions/form-submissions.module';

const routes: Routes = [
	{
		path: 'v1',
		children: [SupportRequestsModule],
	},
];

@Module({
	imports: [RouterModule.register(routes), SupportRequestsModule],
	providers: [],
})
export class V1Module {}
