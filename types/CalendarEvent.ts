type CalendarEvent = {
	id: string;
	summary: string;
	start: {
		dateTime: string;
		timeZone: string;
	};
	end: {
		dateTime: string;
		timeZone: string;
	};
	location: string;
	description: string;
	htmlLink: string;
	data?: Omit<Database.EventData, "id">;
};
