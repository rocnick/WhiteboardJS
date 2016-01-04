function selectSwap() {
  var toList = $(this.parentNode.parentNode).find('sharedUsers:first');
  var fromList = $(this.parentNode.parentNode).find('availableUsers:first');
  console.log(fromList);
  var selected = $(fromList).find('option:selected');
  console.log(selected);
}
