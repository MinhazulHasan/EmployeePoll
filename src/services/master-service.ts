/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-groups/web";
import "@pnp/sp/site-users/web";
import { ToastMessage } from "./toast";

class MasterService {
	public siteUrl: string;
	public sp: any;
	public siteRelativeUrl: string;
	public currentUserId: number;
	public currentUserDetails: any;

	public constructor(context: any) {
		// this.siteUrl = context.pageContext.web.absoluteUrl;

		this.siteUrl = 'https://brainstationo365.sharepoint.com/sites/BS23Poll';

		this.siteRelativeUrl = context.pageContext.web.serverRelativeUrl;
		this.sp = spfi(this.siteUrl).using(SPFx(context));
	}

	public async sumbitQuestionWithAnswers(questionListObj: any, answerListObj: any) {
		try {
			await this.sp.web.lists.getByTitle("QuestionAnswer").items.add(questionListObj);
			answerListObj.forEach(async (element: any) => {
				await this.sp.web.lists.getByTitle("AnswerDetailsAndResponse").items.add(element);
			});
			return true;
		}
		catch (e) {
			console.log(e);
			return false;
		}
	}

	public async getPollDetails(pool: any) {
		try {
			// const questionInfo: any[] = await this.sp.web.lists
			// 	.getByTitle("QuestionAnswer")
			// 	.items.select("Title", "AnswerID")
			// 	.filter(`QuestionID eq '${pool.QuestionID}'`)
			// 	.top(1)();

			if (pool.AnswerID?.length) {
				let optionList: any[] = [];
				const optionIDs = pool.AnswerID.split(",");

				for (let i = 0; i < optionIDs.length; i++) {
					const optionInfo: any[] = await this.sp.web.lists
						.getByTitle("AnswerDetailsAndResponse")
						.items.filter(`AnswerID eq '${optionIDs[i]}'`)
						.select('AnswerID', 'Title', 'Responses/Id', 'Responses/Title')
						.expand('Responses').top(1)();

					const optionObj = {
						AnswerId: optionIDs[i],
						AnswerTitle: optionInfo[0].Title,
						Responses: optionInfo[0].Responses
					};
					optionList.push(optionObj);
				}
				const pollInfo = {
					QuerstionId: pool.QuestionID,
					QuestionTitle: pool.Title,
					AnswerList: optionList,
				};
				return pollInfo;
			}
			return 0;
		} catch (e) {
			console.log(e);
		}
	}


	public async submitVote(responseId: string) {
		try {
			let user = await this.sp.web.currentUser();
			const exist = await this.sp.web.lists.getByTitle('AnswerDetailsAndResponse').items.filter(`AnswerID eq '${responseId}'`).top(1)();
			let responseIdList;
			if(exist[0].ResponsesId) {
				responseIdList = [...exist[0].ResponsesId, user.Id];
			} else {
				responseIdList = [user.Id];
			}
			await this.sp.web.lists.getByTitle('AnswerDetailsAndResponse').items.getById(exist[0].Id).update({ ResponsesId: responseIdList });
			return true;
		} catch (e) {
			console.log(e);
			return false;
		}
	}


	public async getAllPools() {
		try {
			// console.log("URL:", this.siteUrl);
			const items: any[] = await this.sp.web.lists.getByTitle("QuestionAnswer").items.select("Title", "QuestionID", "AnswerID")();
			return items;
		} catch (e) {
			ToastMessage.toastWithConfirmation('error', 'Pool fetching faield', e);
			console.log("Error:", e);
		}
	}


	public async deletePool(pool: any) {
		try {
			const questionToDelete = await this.sp.web.lists.getByTitle("QuestionAnswer").items.filter(`QuestionID eq '${pool.QuestionID}'`).top(1)();
			if(questionToDelete.length > 0) {
                await this.sp.web.lists.getByTitle("QuestionAnswer").items.getById(questionToDelete[0].Id).delete();
            }
			return true;
		}
		catch (e) {
			console.log(e);
			return false;
		}
	}


}

export default MasterService;
