/* eslint-disable no-lone-blocks */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
import * as React from 'react';
import { IPollApplicationProps } from './IPollApplicationProps';
import MasterService from '../../../services/master-service';
import CreatePoll from './CreatePoll/CreatePoll';
import SubmitVote from './SubmitVote/SubmitVote';
import Styles from "./PollApplication.module.scss";
import { HelpCircle, Info, PlusSquare, Trash2 } from 'react-feather';
import PoolResult from './PoolResult/PoolResult';
import Swal from 'sweetalert2';
import { ToastMessage } from '../../../services/toast';
// import { escape } from '@microsoft/sp-lodash-subset';

const PollApplication: React.FC<IPollApplicationProps> = (props: IPollApplicationProps) => {

	const service: MasterService = new MasterService(props.context);

	const [pools, setPools] = React.useState([]);
	const [page, setPage] = React.useState({ PoolApplication: true, CreatePoll: false, SubmitVote: false, PoolResult: false })
	const [selectedPool, setSelectedPool] = React.useState(null);
	const [poolResult, setPoolResult] = React.useState(null);

	const getPoolsFromDb = async () => {
		const poolsFromDb = await service.getAllPools();
		if (poolsFromDb && poolsFromDb.length !== 0) 
			setPools(poolsFromDb);
	}

	const getPollResult = async (pool: any) => {
		const getPoolResult: any = await service.getPollDetails(pool);
		setPoolResult(getPoolResult)
		setPage({ PoolApplication: false, CreatePoll: false, SubmitVote: false, PoolResult: true })
	}

	const removePool = async (pool: any) => {
		Swal.fire({
			icon: "question",
			title: "Are you sure to delete the Pool?",
			toast: true,
			showCancelButton: true,
			confirmButtonText: "Delete",
		}).then(async (result) => {
			if (result.isConfirmed) {
				const deleteResponse = await service.deletePool(pool);
				if (deleteResponse) {
					ToastMessage.toastWithoutConfirmation('success', 'Congrats...', 'Poll Deleted Successfully!');
					const filteredPools = pools.filter((p: any) => p.QuestionID !== pool.QuestionID);
					setPools(filteredPools);
				}
				else {
					ToastMessage.toastWithoutConfirmation('error', 'Action Faield', "Poll wasn't Deleted!");
				}
			}
		})
	}

	React.useEffect(() => {
		getPoolsFromDb();
	}, [page])

	return (
		<div className={Styles.ui_outer}>
			<div className={Styles.ui_container}>
				{page.PoolApplication &&
					<div className={Styles.create_pool_div}>
						<div className={Styles.card_div} id={Styles.create_pool}>
							<div
								className={Styles.title_div}
								onClick={() => setPage({ PoolApplication: false, CreatePoll: true, SubmitVote: false, PoolResult: false })}
								style={{ textAlign: "center" }}
							>
								<PlusSquare />
								<span>Create Pool</span>
							</div>
						</div>
						{
							(pools.length !== 0) &&
							pools.map(pool => (
								<div className={Styles.card_div}>
									<div
										className={Styles.title_div}
										onClick={() => {
											setSelectedPool(pool)
											setPage({ PoolApplication: false, CreatePoll: false, SubmitVote: true, PoolResult: false })
										}}
									>
										<HelpCircle />
										<span>{pool.Title}</span>
									</div>
									<div className={Styles.poll_info}>
										<Info onClick={() => getPollResult(pool)} />
									</div>
									<div className={Styles.remove_poll}>
										<Trash2 onClick={() => removePool(pool)} />
									</div>
								</div>
							))
						}
					</div>
				}
				{page.CreatePoll && <CreatePoll service={service} setPage={setPage} />}
				{page.SubmitVote && <SubmitVote key={selectedPool.QuestionID} pool={selectedPool} setPoolResult={setPoolResult} service={service} setPage={setPage} />}
				{page.PoolResult && <PoolResult poolResult={poolResult} setPage={setPage} />}

			</div>
		</div>
	);
};

export default PollApplication;

{/* <h2>Well done, ${escape(props.context.pageContext.user.displayName)}!</h2> */}