JSONFILES=collision.json group_CATEGORY.json group_CTITLE.json \
group_DATE.json group_GRADE.json group_PLACE.json group_REMARK.json \
movies.json

.PHONY: all
all: gh2014.txt $(JSONFILES)

gh2014.txt:
	python moovee_scrap.py > $@

$(JSONFILES): gh2014.txt
	php ../../includes/prepare.php $<

.PHONY: clean
clean:
	rm -f $(JSONFILES)
