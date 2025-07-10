import * as UiReact from 'tinybase/ui-react/with-schemas';

export const TablesSchema = {
    images:{
		id:{ type: "string" },
		name:{ type: "string" },
		mediaType:{ type: "string" },
		size:{ type: "number" },
		imageUrl:{ type: "string" },
		transformedImageUrl:{ type: "string" },
		height:{ type: "number" },
		width:{ type: "number" },
    },
} as const

const UiReactWithSchemas = UiReact as UiReact.WithSchemas<
	[typeof TablesSchema, any]
>;

export const {
	Provider,
	useCreateIndexes,
	useCreateRelationships,
	useCreatePersister,
	useCreateQueries,
	useCreateStore,
	CellProps,
	useTable,
	useResultTable,
	useResultRow,
	RowView,
	useAddRowCallback,
	useCell,
	useHasTable,
	useValue,
	useHasValue,
	useHasRow,
	useDelRowCallback,
	useRowIds,
	useSetPartialRowCallback,
	useSetPartialValuesCallback,
	useRelationships,
	RemoteRowView,
	useQueries,
	useResultCell,
	useResultSortedRowIds,
	useResultTableCellIds,
	useSetCellCallback,
	useSliceIds,
	useIndexes,
	useSliceRowIds,
	useStore,
	useLocalRowIds,
	CellView,
	ResultCellProps,
	ResultCellView,
	ResultRowView,
} = UiReactWithSchemas;
